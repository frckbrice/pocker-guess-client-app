import React from "react";

type Props = {
  gameUrl: string;
  handleCopy: () => void;
};

const Copy = ({ gameUrl, handleCopy }: Props) => {
  return (
    <section>
      <button
        onClick={async () => {
          if (!gameUrl) return;
          await navigator.clipboard.writeText(gameUrl);
          handleCopy();
        }}
        className="flex gap-1  items-center p-2  text-green-600"
      >
        <span className="text-green-600">
          {gameUrl ? gameUrl : "link to share"}
        </span>
      </button>
    </section>
  );
};

export default Copy;
