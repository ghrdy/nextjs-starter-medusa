import { retrieveCart } from "@lib/data/cart"
import Cart from "../cart"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  return <Cart cart={cart} />
}
