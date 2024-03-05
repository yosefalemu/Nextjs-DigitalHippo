type Product = any;
interface CartItemProps {
  product: Product;
}
const CartItem = ({ product }: CartItemProps) => {
  return (
    <div>
      <p className="">{product.productName}</p>
    </div>
  );
};

export default CartItem;
