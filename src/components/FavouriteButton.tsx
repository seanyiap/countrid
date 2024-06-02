import { FC } from "react";
import { StarBorderIcon, YellowStarIcon } from "../icons";
import { getSavedValue } from "../hooks/useLocalStorage";

interface FavouriteButtonProps {
  countryCode: string;
  onFavourite: (
    e: React.MouseEvent<HTMLButtonElement>,
    countryCode: string
  ) => void;
}

const FavouriteButton: FC<FavouriteButtonProps> = ({
  countryCode,
  onFavourite,
}) => {
  const favourites = getSavedValue("favourites");
  let isFavourite = favourites.includes(countryCode);

  return (
    <button
      name="favourite"
      className="icon-button"
      onClickCapture={(e) => onFavourite(e, countryCode)}
    >
      {isFavourite ? <YellowStarIcon /> : <StarBorderIcon />}
    </button>
  );
};

export default FavouriteButton;
