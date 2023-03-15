import React, { useState } from 'react';
import { client, urlFor } from '../../lib/client';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '@component/components';
import { useModal } from '../../context/modal-context';



const ProductDetails = ({ product, otherProducts }) => {
  const { image, name, details, price, _id } = product;
  const [index, setIndex] = useState(0);
  const { setModal } = useModal();
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [rate, setRate] = useState(null);
  const [addingComment, setAddingComment] = useState(false);


  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client.patch(_id)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
        }])
        .commit()
        .then(() => {
          setUserName('');
          setRate('');
          setComment('');
          setAddingComment(false);
        })
    }
  }


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
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity: </h3>
            <p className='quantity-desc'>
              <span className='minus' onClick=''><AiOutlineMinus /></span>
              <span className='num' onClick=''>0</span>
              <span className='plus' onClick=''><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
            <button
              type='button'
              className='add-to-cart'
              onClick=''
            >
              Add to Cart
            </button>
            <button
              type='button'
              className='buy-now'
              onClick=''
            >
              Buy Now
            </button>
          </div>
        </div>
        <div className='comments-container'>
          <div className='comments'>
            <h2>Customer reviews:</h2>
            {product.comments?.map((item) => (
              <div className="all-comments" key={item.comment}>
                <div className='comment-user-rate'>
                  <span className="comment-user">{item.userName}</span>
                  <span className="comment-rate">{item.rate}/5</span>
                </div>
                <p className="comment-content">{item.comment}</p>
              </div>
            ))}
            <label
              className="App-link"
              onClick={() => {
                setModal(
                  <>
                    <h3>Your review</h3>
                    <form method="post" className="">
                      <div className="">
                        <input
                          type="text"
                          name="userName"
                          id="userName"
                          placeholder='Your name'
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          type="number"
                          name="rate"
                          id="rate"
                          placeholder='Your rate'
                          min="0"
                          max="5"
                          value={rate}
                          onChange={(e) => setRate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="">
                        <textarea
                          id="newComment"
                          name="newComment"
                          rows="5"
                          cols="33"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder='Tell us about this product'
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
              Add a review
            </label>
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
