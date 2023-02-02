export default async function handler(req: any, res: any) {
  // console.log(req.query.url);
  let url: string;
  if (process.env.NODE_ENV === "development") {
    url = "https://cors-anywhere.herokuapp.com/" + req.query.url;
  } else {
    url = req.query.url;
  }
  // console.log(url);
  const response = await fetch(url, {
    method: "POST",
    body: req.body,
    mode: "no-cors",
  });
  // console.log(response);
  res.status(200).json(response);
}
