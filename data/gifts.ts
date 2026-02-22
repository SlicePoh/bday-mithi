export type GiftStatus = "selected" | "empty";

export interface Gift {
  id: number;
  title: string;
  description: string;
  link: string | null;
  status: GiftStatus;
  imageSrc?: string;
  keepConfirmed?: boolean;
}

export const initialGifts: Gift[] = [
  {
    id: 1,
    title: "Cute printed ankle socks",
    description: "Tiny happy socks for everyday cute fits.",
    link: null,
    status: "selected",
    imageSrc: "/assets/cutesocks.jpg",
    keepConfirmed: false,
  },
  {
    id: 2,
    title: "Slippers to wear at home",
    description: "Cozy, soft, and the perfect home vibe.",
    link: 'https://amzn.in/d/02sK4G8J',
    status: "selected",
    imageSrc: "/assets/flipflop.jpg",
    keepConfirmed: false,
  },
  {
    id: 3,
    title: "Fleece stockings",
    description: "Warm, comfy, and winter-ready.",
    link: "",
    status: "selected",
    keepConfirmed: false,
    imageSrc: "/assets/leggings.jpg",
  },
  {
    id: 5,
    title: "Desk lamp",
    description: "Soft light for late-night cozy productivity.",
    link: "https://amzn.in/d/0iebIfvL",
    status: "selected",
    imageSrc: "/assets/tablelamp.jpg",
    keepConfirmed: false,
  },
  {
    id: 6,
    title: "Sipper",
    description: "Aesthetic hydration.",
    link: "https://amzn.in/d/0eSvynNn",
    status: "selected",
    imageSrc: "/assets/tumbler.jpg",
    keepConfirmed: false,
  },
  {
    id: 7,
    title: "Floor lamp",
    description: "Warm glow for a cozy corner.",
    link: "https://amzn.in/d/05jIgDRU",
    status: "selected",
    imageSrc: "/assets/floorlamp.jpg",
    keepConfirmed: false,
  },
  {
    id: 8,
    title: "Cherry red shoulder bag",
    description: "That Pinterest cherry-red moment.",
    link: null,
    status: "empty",
  },
  {
    id: 9,
    title: "Gym / workout pants",
    description: "Your dream comfy-cute workout pants.",
    link: null,
    status: "empty",
  },
  {
    id: 10,
    title: "White curtains",
    description: "Soft airy curtains for dreamy mornings.",
    link: null,
    status: "empty",
  },
];
