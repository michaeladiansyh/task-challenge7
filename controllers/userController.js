const User = require("../models").UserGame;
const Room = require("../models").room;
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
const response = require("../helpers/response");

const format = (user) => {
  const { id, username, asAdmin } = user;
  console.log(user);
  return {
    id,
    username,
    asAdmin,
    accessToken: user.generateToken(),
  };
};

const register = async (req, res) => {
  try {
    const { username, password, asAdmin } = req.body;

    //checking role
    if (asAdmin !== true && asAdmin !== false) {
      return res.json("Role is not allowed");
    }

    //check user
    const checkUser = await User.findOne({
      where: {
        username: username,
      },
    });

    if (checkUser) {
      return res.response(res, 400, false, "User sudah terdaftar");
    }
    const user = await User.create({
      username,
      password,
      asAdmin,
    });
    return response(res, 201, true, "User berhasil dibuat", user);
  } catch (error) {
    return response(res, 500, false, "Internal Server Error");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  let user = {};
  try {
    user = await User.findOne({
      where: { username: username },
    });
    if (!user) {
      return response(res, 400, false, "Username doesn't exist");
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return response(res, 400, false, "wrong password");
    }
    res.cookie("jwt", user.generateToken());
    return response(res, 200, false, "User berhasil login", format(user));
  } catch (error) {
    return response(res, 500, false, "internal server error");
  }
};

const createRoom = async (req, res) => {
  try {
    const { roomName } = req.body;
    const room = await Room.create({
      roomName,
    });
    return response(res, 201, true, "Room berhasil dibuat", room);
  } catch (error) {
    return response(res, 500, false, "Internal Server Error");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return response(res, 200, true, "List User ditemukan", users);
  } catch (error) {
    return response(res, 500, true, "Internal Server Error", error);
  }
};

module.exports = {
  register,
  login,
  createRoom,
  getUsers,
};
