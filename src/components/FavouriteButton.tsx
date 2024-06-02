import { FC } from "react";
import { StarBorderIcon, YellowStarIcon } from "../icons";
import { getSavedValue } from "../hooks/useLocalStorage";

interface FavouriteButtonProps {
  country: string;
  handleFavourite: (
    e: React.MouseEvent<HTMLButtonElement>,
    country: string
  ) => void;
}

const FavouriteButton: FC<FavouriteButtonProps> = ({
  country,
  handleFavourite,
}) => {
  const favourites = getSavedValue("favourites", []);
  let isFavourite = favourites.includes(country);

  return (
    <button
      name="favourite"
      className="icon-button"
      onClickCapture={(e) => handleFavourite(e, country)}
    >
      {isFavourite ? <YellowStarIcon /> : <StarBorderIcon />}
    </button>
  );
};

export default FavouriteButton;
