import Community from "../models/community.js";
import { Member } from "../models/member.js";
import Role from "../models/role.js";
import User from "../models/user.js";
import validator from "validatorjs";

const addMember = async (req, res) => {
  const { id } = req.user;
  const { community, user, role } = req.body;
  // validate input: community: id of the community, required
  // user: id of the user, required,
  // role: id of the role, required
  const rules = {
    community: "required|string",
    user: "required|string",
    role: "required|string",
  };
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }

  if (id == user)
    return res
      .status(400)
      .json({ message: "You can't add yourself to a community" });

  try {
    const FoundCommunity = await Community.findOne({
      where: { id: community },
    });
    const FoundUser = await User.findOne({ where: { id: user } });
    const FoundRole = await Role.findOne({ where: { id: role } });
    console.log(FoundCommunity, FoundUser, FoundRole);
    if (
      FoundCommunity &&
      FoundUser &&
      FoundRole &&
      FoundCommunity.owner == id
    ) {
      const memberDetails = {
        id: Snowflake.generate(),
        community: FoundCommunity.id,
        user: FoundUser.id,
        role: FoundRole.id,
      };
      const member = await Member.create(memberDetails);
      return res.status(201).json({
        status: true,
        Content: {
          data: member,
        },
      });
    } else {
      if (!community)
        return res.status(400).json({ message: "Community not found" });
      if (!user) return res.status(400).json({ message: "User not found" });
      if (!role) return res.status(400).json({ message: "Role not found" });
      if (FoundCommunity.owner != id)
        return res.status(401).json({ message: "NOT_ALLOWED_ACCESS" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const removeMember = async (req, res) => {
  const { id } = req.user;
  const user = req.params.id;
  try {
    // SELECT * FROM communities WHERE id IN (SELECT id FROM roles WHERE name = 'Community Moderator') OR id = owner;
    const FoundCommunity = await Community.findOne({
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
      const FoundMember = await Member.findOne({
        where: {
          user,
          community: FoundCommunity.id,
        },
      });
      if (FoundMember) {
        await FoundMember.destroy();
        return res.status(200).json({
          status: true,
        });
      } else {
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
