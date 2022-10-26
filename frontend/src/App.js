import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Homepage from "./pages/Homepage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Profile from "./pages/Profile";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import Users from "./pages/Admin/Users";
import EditUser from "./pages/Admin/Users/EditUser";
import Products from "./pages/Admin/Products";
import EditProduct from "./pages/Admin/Products/EditProduct";
import Orders from "./pages/Admin/Orders";

const App = () => {
	return (
		<BrowserRouter>
			<Header />
			<main className="py-3">
				<Container>
					<Switch>
						<Route exact path="/" component={Homepage} />
						<Route path="/product/:id" component={ProductDetails} />
						<Route exact path="/cart" component={Cart} />
						<Route exact path="/cart/:id" component={Cart} />
						<Route exact path="/login" component={Loginpage} />
						<Route exact path="/register" component={Signuppage} />
						<Route exact path="/profile" component={Profile} />
						<Route exact path="/shipping" component={Shipping} />
						<Route exact path="/payment" component={Payment} />
						<Route exact path="/order" component={PlaceOrder} />
						<Route exact path="/order/:id" component={Order} />
						<Route exact path="/admin/users" component={Users} />
						<Route exact path="/admin/user/:id/edit" component={EditUser} />
						<Route exact path="/admin/productlist" component={Products} />
						<Route exact path="/admin/orderlist" component={Orders} />
						<Route
							exact
							path="/admin/product/:id/edit"
							component={EditProduct}
						/>
						<Route exact path="/search/:keyword" component={Homepage} />
					</Switch>
				</Container>
			</main>
			<Footer />
		</BrowserRouter>
	);
};

export default App;
