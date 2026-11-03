import { getImage } from "astro:assets";

/** OG 이미지 권장 너비(1200px) JPEG로 변환해 절대 URL 반환. 원본이 배포물에 그대로 포함되지 않도록 함 */
export async function getOgImageUrl(
  image: ImageMetadata | undefined,
  site: URL | undefined,
): Promise<string | undefined> {
  if (!image) return undefined;
  const { src } = await getImage({
    src: image,
    width: 1200,
    format: "jpeg",
    quality: 80,
  });
  return new URL(src, site).href;
}
