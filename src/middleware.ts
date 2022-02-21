export const authMiddleware = async (resolve, root, args, context, info) => {
  console.log(`1. LogInput:`,info)
  const result = await resolve(root, args, context, info)
  console.log(`2. logInput`)
  return result
}