import React from 'react';
import { BsStar, BsStarHalf, BsStarFill } from 'react-icons/bs';

const RatingStars = ({ averageRate }) => {
  let count = averageRate;
  let stars = [];
  do {
    if (count > 0.74) {
      stars.push(<BsStarFill />);
      count -= 1;
    } else if (count > 0.24) {
      stars.push(<BsStarHalf />);
      count = 0
    } else {
      count = 0
    }
  } while (count > 0)
  do {
    stars.push(<BsStar />)
  } while (stars.length < 5)

  return (
    <>
      {stars.map((star, i) => (
        <span key={`star-${i}`}>{star}</span>
      ))}
    </>
  )
}

export default RatingStars
