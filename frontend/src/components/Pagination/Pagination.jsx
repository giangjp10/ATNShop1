import React from "react";
import { Pagination, Button } from "react-bootstrap";

const Paginate = ({
	setPageNum,
	pages,
	page,
	isAdmin = false,
	keyword = "",
}) => {
	return (
		pages > 1 && (
			<Pagination
				style={{ width: "max-content", margin: "2rem auto 0" }}
				className="mt-4 border"
			>
				{[...Array(pages).keys()].map((x) => (
					<Button
						key={x + 1}
						type="button"
						onClick={() => setPageNum(x + 1)}
						className="btn btn-light"
					>
						<Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
					</Button>
				))}
			</Pagination>
		)
	);
};

export default Paginate;
