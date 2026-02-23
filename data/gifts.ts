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
    link: "https://amzn.in/d/017u9Dxh",
    status: "selected",
    imageSrc: "/assets/cutesocks.jpg",
    keepConfirmed: true,
  },
  {
    id: 2,
    title: "Slippers to wear at home",
    description: "Cozy, soft, and the perfect home vibe.",
    link: 'https://amzn.in/d/02sK4G8J',
    status: "selected",
    imageSrc: "/assets/flipflop.jpg",
    keepConfirmed: true,
  },
  {
    id: 3,
    title: "Fleece stockings",
    description: "Warm, comfy, and winter-ready (IK winter is gone but still..).",
    link: "https://amzn.in/d/00BnCcg2",
    status: "selected",
    keepConfirmed: true,
    imageSrc: "/assets/leggings.jpg",
  },
  {
    id: 5,
    title: "Desk lamp",
    description: "Soft light for late-night cozy productivity.",
    link: "https://amzn.in/d/0iebIfvL",
    status: "selected",
    imageSrc: "/assets/tablelamp.jpg",
    keepConfirmed: true,
  },
  {
    id: 6,
    title: "Some more socks",
    description: "Cuz we need those right?",
    link: "https://amzn.in/d/04bHCeOk",
    status: "selected",
    imageSrc: "/assets/cutesocks1.jpg",
    keepConfirmed: true,
  },
  {
    id: 7,
    title: "Sipper",
    description: "Aesthetic hydration.",
    link: "https://amzn.in/d/0eSvynNn",
    status: "selected",
    imageSrc: "/assets/tumbler.jpg",
    keepConfirmed: true,
  },
  {
    id: 8,
    title: "Floor lamp",
    description: "Warm glow for a cozy corner.",
    link: "https://dl.flipkart.com/s/b8BWrnNNNN",
    status: "selected",
    imageSrc: "/assets/floorlamp.jpg",
    keepConfirmed: true,
  },
  {
    id: 9,
    title: "Warmth by Rithvik Singh",
    description: "Suggested by Bonu",
    link: "https://dl.flipkart.com/s/bsnxzuNNNN",
    status: "selected",
    imageSrc: "/assets/warmth.jpg",
    keepConfirmed: true,
  },
  {
    id: 10,
    title: "Cherry red shoulder bag",
    description: "That Pinterest cherry-red moment.",
    link: null,
    status: "empty",
  },
  {
    id: 11,
    title: "Gym / workout pants",
    description: "Your dream comfy-cute workout pants.",
    link: null,
    status: "empty",
  },
  {
    id: 12,
    title: "White curtains",
    description: "Soft airy curtains for dreamy mornings.",
    link: null,
    status: "empty",
  },
];
