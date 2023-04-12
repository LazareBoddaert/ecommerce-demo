import React, { useState, useRef, useEffect } from 'react';
import { client, urlFor } from '../../lib/client';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Product } from '@component/components';
import { useStateContext } from '../../context/StateContext'
import { useModal } from '../../context/modal-context';
import { v4 as uuidv4 } from 'uuid';
import RatingStars from '@component/components/RatingStars';


const ProductDetails = ({ product, otherProducts }) => {
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);
  const { setModal } = useModal();
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();
  const [addingComment, setAddingComment] = useState(false);
  const inputUserName = useRef(null);
  const inputRate = useRef(null);
  const inputComment = useRef(null);

  const handleBuyNow = () => {
    onAdd(product, qty);

    setShowCart(true);
  }

  const addComment = () => {
    setAddingComment(true);

    client.patch(product._id)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [{
        userName: inputUserName.current.value,
        rate: parseInt(inputRate.current.value),
        comment: inputComment.current.value,
        _key: uuidv4(),
      }])
      .commit()
      .then(() => {
        setAddingComment(false);
        window.location.reload(false);
      })
  }

  let allRates = 0;
  for (let i = 0; i < product.comments?.length; i++) {
    allRates += product.comments[i].rate
  }
  let averageRate = allRates / product.comments?.length;

  return (
    <div>
      <div className='product-detail-container'>
        <div>
          <div className='image-container'>
            <img src={urlFor(image && image[index])} className='product-detail-image' />
          </div>
          <div className='small-images-container'>
            {image?.map((item, i) => (
              <img
                key={`${item}-${i}`}
                src={urlFor(item)}
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
        <div className='product-detail-desc'>
          <h1>{name}</h1>
          <div className="reviews">
            <div className="product-rating-stars">
              <RatingStars averageRate={averageRate} />
            </div>
            <p>({product.comments?.length || 0})</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">€{price}</p>
          <div className="quantity">
            <h3>Quantity: </h3>
            <p className='quantity-desc'>
              <span className='minus' onClick={decQty}><AiOutlineMinus /></span>
              <span className='num'>{qty}</span>
              <span className='plus' onClick={incQty}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
            <button
              type='button'
              className='add-to-cart'
              onClick={() => onAdd(product, qty)}
            >
              Add to Cart
            </button>
            <button
              type='button'
              className='buy-now'
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
        <div className='comments-wrapper'>
          <div className='comments-container'>
            <div className='comments'>
              {product.comments ? <h2>Customer reviews:</h2> : <h2>No review for this product</h2>}
              {product.comments?.map((item, i) => (
                <div key={i}>
                  {i < 5 &&
                    <div className="all-comments">
                      <div className='comment-user-rate'>
                        <span className="comment-user">{item.userName}</span>
                        <span className="comment-rate">{item.rate}/5</span>
                      </div>
                      <p className="comment-content">{item.comment}</p>
                    </div>
                  }
                </div>
              ))}
              {product.comments?.length > 5 &&
                <label
                  className="more-comments App-link"
                  onClick={() => {
                    setModal(
                      <div className='modal-com'>
                        <h3 className='modal-title-comments'>All reviews for this product:</h3>
                        {product.comments?.map((item, i) => (
                          <div className="modal-comments all-comments" key={i}>
                            <div className='comment-user-rate'>
                              <span className="comment-user">{item.userName}</span>
                              <span className="comment-rate">{item.rate}/5</span>
                            </div>
                            <p className="comment-content">{item.comment}</p>
                          </div>
                        ))}
                      </div>
                    )
                  }}
                >
                  Show all comments
                  <br />
                </label>
              }
              <label
                className="add-review App-link"
                onClick={() => {
                  setModal(
                    <>
                      <h3>Your review</h3>
                      <form method="get" className="" id="ratingsForm">
                        <div className="">
                          <input
                            type="text"
                            name="userName"
                            id="userName"
                            placeholder='Your name'
                            ref={inputUserName}
                            required
                          />
                        </div>
                        <div className="stars-form">
                          <input type="number" id="rating" name="rating" min='0' max='5' ref={inputRate} required />
                          Your rate (0-5)
                        </div>
                        <div className="">
                          <textarea
                            id="newComment"
                            name="newComment"
                            rows="5"
                            cols="33"
                            placeholder='Tell us about this product'
                            ref={inputComment}
                            required
                          />
                        </div>
                        <div className="buttons">
                          <button
                            type='submit'
                            className=''
                            onClick={addComment}
                          >
                            {addingComment ? 'Posting...' : 'Post'}
                          </button>
                        </div>
                      </form>
                    </>
                  )
                }}
              >
                <p>Add a review</p>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className='maylike-products-wrapper'>
        <h2>You may also like</h2>
        <div className='marquee'>
          <div className='maylike-products-container track'>
            {otherProducts.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type] == "product" {
    slug {
      current
    }
  }`;

  const products = await client.fetch(query);

  const paths = Object.keys(products).map((key) => {
    const product = products[key];

    return{
      params: {slug: product.slug.current}
    }
  });


  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const productQuery = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const otherProductsQuery = '*[_type == "product"]';

  const product = await client.fetch(productQuery);
  const otherProducts = await client.fetch(otherProductsQuery);


  return {
    props: { product, otherProducts }
  }
}

export default ProductDetails
