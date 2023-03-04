import jwt from "jsonwebtoken";

const SignToken = async (email: any) => {
  console.log(email);
  const token = jwt.sign(
    JSON.stringify({ emailAddress: email }),
    process.env.NEXTAUTH_SECRET,
    {
      expiresIn: "1d",
    },
    function (err, token) {
      console.log(err, token);
    }
  );
  return token;
};

export default SignToken;
