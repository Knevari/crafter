
const recycledIds: number[] = [];
let currentId: number = 0;

export function getId(): number {
  if (recycledIds.length > 0) {
    return recycledIds.pop()!;
  }
  return currentId++;
}
