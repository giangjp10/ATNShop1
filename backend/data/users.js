import bcrypt from "bcryptjs";

const users = [
	{
		name: "Origho Precious",
		email: "origho9@gmail.com",
		password: bcrypt.hashSync("12345678", 10),
		isAdmin: true,
	},
	{
		name: "Prayer Nuchi",
		email: "prayer@gmail.com",
		password: bcrypt.hashSync("12345678", 10),
	},
	{
		name: "Origho Divine",
		email: "orighodivine@gmail.com",
		password: bcrypt.hashSync("12345678", 10),
	},
];

export default users;
