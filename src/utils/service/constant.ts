import io from "socket.io-client";
export const GOOGLE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_CLIENT;

export const api_call =
  (process.env.NEXT_PUBLIC_REMOTE_BURL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
export const public_call = process.env.NEXT_PUBLIC_VERCEL_URL;
export const socket = io(api_call || "", {
  path: "/socket.io/",
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  upgrade: false,
  withCredentials: true,
});

export const arrObjectToObjectOfObject = (arr: any[]) => {
  const subarrays = arr.reduce(
    (acc: object[][], obj: object, index: number) => {
      if (index % 2 === 0) {
        acc.push([obj, {}]);
      } else {
        acc[acc.length - 1].push(obj);
      }
      return acc;
    },
    []
  );
};


const divEvenArray = (arr: any[]): any[] => {
  let arr2: any[] = [];
  for (let i = 0; i < arr.length - 2; i += 2) {
    let sl = arr.slice(i, i + 2);
    if (sl.length) {
      const value = { ...sl[0], ...sl[1] };
      arr2.push(value);
    }
    sl = [];
  }
  console.log(arr2);
  return arr2;
};

export const subdivideArr = (arr: any) => {
  let arr2: any[] = [];
  if (arr.length) return [new Set(arr)];
  if (arr.length % 2) {
    let arr1 = arr[arr.length - 1];
    return [...divEvenArray(arr), ...arr1];
  } else {
    return divEvenArray(arr);
  }
};
