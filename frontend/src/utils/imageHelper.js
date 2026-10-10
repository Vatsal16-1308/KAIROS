import hero1 from "../assets/images/hero.jpg";
import hero2 from "../assets/images/hero2.jpg";
import hero3 from "../assets/images/hero3.jpg";
import hero4 from "../assets/images/hero4.jpg";

const imageMap = {
  1: hero2,
  2: hero3,
  3: hero4,
  4: hero1,
  5: hero2,
  6: hero3,
  7: hero4,
};

export function getEventImage(event) {
  if (event?.image && typeof event.image === "string" && (event.image.startsWith("http") || event.image.startsWith("data:") || event.image.startsWith("/"))) {
    return event.image;
  }
  if (event?.imageUrl && (event.imageUrl.startsWith("http") || event.imageUrl.startsWith("data:") || event.imageUrl.startsWith("/"))) {
    return event.imageUrl;
  }
  if (event?.id && imageMap[event.id]) {
    return imageMap[event.id];
  }
  // Category based fallback
  const cat = (event?.category || "").toLowerCase();
  if (cat.includes("hack")) return hero3;
  if (cat.includes("music")) return hero4;
  if (cat.includes("sport")) return hero1;
  return hero2;
}

export { hero1, hero2, hero3, hero4 };
