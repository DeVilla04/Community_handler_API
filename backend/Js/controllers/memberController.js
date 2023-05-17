import validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import { Op, Sequelize } from "sequelize";
import Community from "../models/community.js";
import { Member } from "../models/member.js";
import Role from "../models/role.js";
import User from "../models/user.js";

const addMember = async (req, res) => {
  const { id } = req.user; // id of the user making the request (the user who is logged in)
  const { community, user, role } = req.body; // community, user and role to be added
  // validate input: community: id of the community, required
  // user: id of the user, required,
  // role: id of the role, required
  const rules = {
    community: "required|string", // community is required and must be a string
    user: "required|string", // user is required and must be a string
    role: "required|string", // role is required and must be a string
  };
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }

  if (id == user)
    // if the user making the request is the same as the user to be added,
    return res
      .status(400)
      .json({ message: "You can't add yourself to a community" });

  try {
    const FoundCommunity = await Community.findOne({
      where: { id: community }, // find the community with the id provided
    });
    const FoundUser = await User.findOne({ where: { id: user } }); // find the user with the id provided
    const FoundRole = await Role.findOne({ where: { id: role } }); // find the role with the id provided
    console.log(FoundCommunity, FoundUser, FoundRole);
    // check if the community, user and role exist
    if (
      FoundCommunity &&
      FoundUser &&
      FoundRole &&
      FoundCommunity.owner == id
    ) {
      // if the community, user and role exist
      const memberDetails = {
        // create a new member
        id: Snowflake.generate(),
        community: FoundCommunity.id,
        user: FoundUser.id,
        role: FoundRole.id,
      };
      const member = await Member.create(memberDetails);
      return res.status(201).json({
        // return the created member
        status: true,
        Content: {
          data: member,
        },
      });
    } else {
      // if the community, user or role does not exist
      if (!community)
        // if the community does not exist
        return res.status(400).json({ message: "Community not found" });
      if (!user) return res.status(400).json({ message: "User not found" }); // if the user does not exist
      if (!role) return res.status(400).json({ message: "Role not found" }); // if the role does not exist
      if (FoundCommunity.owner != id)
        // if the user making the request is not the owner of the community
        return res.status(401).json({ message: "NOT_ALLOWED_ACCESS" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const removeMember = async (req, res) => {
  const { id } = req.user; // id of the user making the request (the user who is logged in)
  const user = req.params.id; // id of the user to be removed
  try {
    // SELECT * FROM communities WHERE id IN (SELECT id FROM roles WHERE name = 'Community Moderator') OR id = owner;
    const FoundCommunity = await Community.findOne({
      // find the community where the user making the request is the owner or the user is a community moderator
      where: {
        [Op.or]: [
          {
            owner: id,
          },
          {
            id: {
              [Op.in]: [
                Sequelize.literal(
                  `SELECT id FROM roles WHERE name = 'Community Moderator'`
                ),
              ],
            },
          },
        ],
      },
    });
    if (FoundCommunity) {
      // if the community exists
      const FoundMember = await Member.findOne({
        // find the member to be removed
        where: {
          user,
          community: FoundCommunity.id,
        },
      });
      if (FoundMember) {
        // if the member exists
        await FoundMember.destroy(); // delete the member
        return res.status(200).json({
          status: true,
        });
      } else {
        // if the member does not exist
        return res.status(400).json({ message: "Member not found" });
      }
    } else {
      return res.status(401).json({ message: "NOT_ALLOWED_ACCESS" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export { addMember, removeMember };
