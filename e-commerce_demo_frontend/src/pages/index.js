import React from 'react'

const index = () => {
  return (
    <>
      HeroBanner

      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers</p>
      </div>
      <div className="products-container">
        {['Prod 1', 'Prod 2', 'Prod 3'].map((product) => product)}
      </div>

      Footer
    </>
  )
}

export default index
