/*
  Shows a project cover without cropping it.

  Cover images come in many shapes (1.5:1 up to 3.2:1), so the
  whole image is fitted inside its frame and any leftover space
  is filled with a blurred copy of the same image instead of
  empty bars. The parent frame must be position: relative and
  overflow: hidden.
*/

interface CoverImageProps {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
}


export default function CoverImage({
  src,
  alt,
  loading,
}: CoverImageProps) {

  return (

    <>

      <div
        className="cover-image-backdrop"
        style={{
          backgroundImage:
            `url("${src}")`,
        }}
        aria-hidden="true"
      />


      <img
        className="cover-image"
        src={src}
        alt={alt}
        loading={loading}
      />

    </>

  );
}
