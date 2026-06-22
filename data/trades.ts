import type { Trade } from "@/types/finance";

export const trades: Trade[] = [
  {
    time: "09:32",
    symbol: "VTI",
    side: "Buy",
    quantity: 2100,
    price: 304.18,
    status: "Filled",
  },
  {
    time: "10:11",
    symbol: "NAFTRAC",
    side: "Buy",
    quantity: 38500,
    price: 57.42,
    status: "Filled",
  },
  {
    time: "11:46",
    symbol: "MXN/USD",
    side: "Hedge",
    quantity: 0.2,
    quantityLabel: "20%",
    price: 18.44,
    priceLabel: "18.44",
    status: "Live",
  },
  {
    time: "13:08",
    symbol: "CETES",
    side: "Roll",
    quantity: 0.16,
    quantityLabel: "16%",
    price: 10.91,
    priceLabel: "10.91%",
    status: "Queued",
  },
];
