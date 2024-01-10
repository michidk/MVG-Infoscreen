import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // TODO: Change this to allow all once we're ready to go live
      // userAgent: "*",
      // allow: "/",
      disallow: "*",
    },
  }
}
