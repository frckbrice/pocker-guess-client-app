type CardProps = {
  image: string;
  onClick?: () => void;
  text: string;
  className: string;
  category: string;
};

export default function Card({
  image,
  onClick,
  text,
  className,
  category,
}: CardProps) {
  const isImageCategory = category?.toLowerCase() === "images";
  const isWordCategory = category?.toLowerCase() === "words";

  return (
    <button
      onClick={onClick}
      style={{
        backgroundImage: isImageCategory ? `url(${image})` : "none",

        backgroundSize: "cover",
        backgroundPosition: "center",
        objectFit: "fill",
      }}
      className={` ${className} border-2 rounded-md border-gray-300 flex justify-center items-center text-black`}
    >
      <h2 className=" w-fit">
        {isWordCategory ? text.substring(0, 8) : ""}
      </h2>
    </button>
  );
}
