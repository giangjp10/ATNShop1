import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Message from "../../../components/Message/Message";
import Loader from "../../../components/Loader/Loader";
import {
	editProduct,
	getProductDetails,
	resetSelectedProduct,
} from "../../../store/slices/product.slice";
import FormContainer from "../../../components/FormContainer/FormContainer";
import axios from "axios";

const EditUser = ({ match, history }) => {
	const productId = match?.params?.id;
	const dispatch = useDispatch();
	const {
		authReducer: { authenticated, userInfo },
		productReducer: {
			product,
			loading,
			productUpdateSuccess,
			productUpdateError: error,
		},
	} = useSelector((state) => state);
	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState("");
	const [brand, setBrand] = useState("");
	const [category, setCategory] = useState("");
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState("");
	const [canSubmitForm, setCanSubmitForm] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		!authenticated && history.push("/login");
		!userInfo?.isAdmin && history.push("/");
		!productId && history.push("/admin/productlist");
	}, [history, authenticated, userInfo, productId]);

	useEffect(() => {
		productId && dispatch(getProductDetails(productId));
	}, [dispatch, productId]);

	useEffect(() => {
		productUpdateSuccess && history.push("/admin/productlist");

		return () => {
			dispatch(resetSelectedProduct());
		};
	}, [dispatch, history, productUpdateSuccess]);

	useEffect(() => {
		setName(product?.name);
		setPrice(product?.price);
		setBrand(product?.brand);
		setImage(product?.image);
		setCategory(product?.category);
		setCountInStock(product?.countInStock);
		setDescription(product?.description);
	}, [product, dispatch, productId]);

	useEffect(() => {
		if (
			name ||
			price ||
			brand ||
			image ||
			category ||
			countInStock ||
			description
		) {
			setCanSubmitForm(true);
		} else {
			setCanSubmitForm(false);
		}
	}, [brand, category, countInStock, description, image, name, price]);

	const handleSubmit = (e) => {
		e.preventDefault();

		let newProduct = {
			name,
			price,
			brand,
			image,
			category,
			countInStock,
			description,
		};

		canSubmitForm && dispatch(editProduct(productId, newProduct));
	};

	const fileUploader = async (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			upload(reader.result);
		};

		const upload = async (image) => {
			console.log(111);

			if (image) {
				setUploading(true);

				try {
					const config = {
						headers: {
							"Content-Type": "application/json",
						},
					};

					const { data } = await axios.post(
						"/api/upload",
						JSON.stringify({ image: image }),
						config
					);
					setUploading(false);
					setImage(data);
					setErrorMsg("");
				} catch (error) {
					setErrorMsg("Image upload failed");
					setUploading(false);
				}
			}
		};
	};

	return (
		<>
			<Button
				className="btn btn-light my-3"
				onClick={() => {
					dispatch(resetSelectedProduct());
					history.push("/admin/productlist");
				}}
			>
				Go Back
			</Button>
			<FormContainer>
				<h1>Edit Product </h1>
				{error && <Message variant="danger">{error}</Message>}
				{loading ? (
					<Loader />
				) : (
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="name"
								placeholder="Enter name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="price">
							<Form.Label>Price</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter price"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="image">
							<Form.Label>Image</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter image url"
								value={image}
								onChange={(e) => setImage(e.target.value)}
							/>
							<Form.File
								id="image-file"
								label="Choose File"
								custom
								onChange={fileUploader}
							/>
							{uploading ? (
								<Loader />
							) : (
								errorMsg && <Message variant="danger">{errorMsg}</Message>
							)}
						</Form.Group>

						<Form.Group controlId="brand">
							<Form.Label>Brand</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter brand"
								value={brand}
								onChange={(e) => setBrand(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="countInStock">
							<Form.Label>Count In Stock</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter countInStock"
								value={countInStock}
								onChange={(e) => setCountInStock(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="category">
							<Form.Label>Category</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="description">
							<Form.Label>Description</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</Form.Group>

						<Button disabled={!canSubmitForm} type="submit" variant="primary">
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default EditUser;
