import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { getTopRatedProducts } from "../../store/slices/products.slice";

const ProductCarousel = () => {
	const dispatch = useDispatch();

	const { loading, topRatedProducts } = useSelector(
		(state) => state.productListReducer
	);

	useEffect(() => {
		dispatch(getTopRatedProducts());
	}, [dispatch]);

	return loading ? (
		<Loader />
	) : (
		topRatedProducts?.length && (
			<Carousel pause="hover" className="bg-dark">
				{topRatedProducts.map((product) => (
					<Carousel.Item key={product?._id}>
						<Link to={`/product/${product?._id}`}>
							<Image src={product?.image} alt={product?.name} fluid />
							<Carousel.Caption className="carousel-caption">
								<h2>
									{product?.name} (${product?.price})
								</h2>
							</Carousel.Caption>
						</Link>
					</Carousel.Item>
				))}
			</Carousel>
		)
	);
};

export default ProductCarousel;
