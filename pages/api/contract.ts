import type { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case "GET":
      res.json({
        name: "EY Blockchain Badge",
        description: "",
        image: "https://badge.eybc.xyz/img/placeholder.png",
        external_link: "https://badge.eybc.xyz/",
      });
      break;

    default:
      res.status(405).send("Method Not Allowed");
  }
};

export default handler;
