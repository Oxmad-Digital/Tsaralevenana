import Image from "next/image";
import styles from "./PhotoFrame.module.css";

type PhotoFrameProps = {
  src?: string;
  alt?: string;
  placeholder?: string;
  className?: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  sizes?: string;
};

/**
 * Cadre photo réutilisable : affiche l'image si `src` est fourni,
 * sinon un placeholder discret invitant à déposer une photo.
 * Remplace les balises <image-slot> du gabarit d'origine.
 */
export default function PhotoFrame({
  src,
  alt = "",
  placeholder = "Déposez une photo",
  className,
  objectPosition,
  objectFit,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: PhotoFrameProps) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={styles.image}
          style={{
            ...(objectPosition ? { objectPosition } : {}),
            ...(objectFit ? { objectFit } : {}),
          }}
        />
      ) : (
        <span className={styles.placeholder}>{placeholder}</span>
      )}
    </div>
  );
}
