"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { guestsAtom } from "@/lib/atoms";

export default function GuestFields({ item }: { item: any }) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [index, setIndex] = useState();
  const [guests, setGuests] = useAtom(guestsAtom);

  //   console.log(guests);
  //   const router = useRouter();
  //   const pathname = usePathname();
  //   console.log(item);

  //   useEffect(() => {
  //     //   console.log(name, value, index, current);
  //     //   let email: any, newname: any;
  //     //   if (name === "fullname") {
  //     //     newname = value;
  //     //   } else if (name === "email") {
  //     //     email = value;
  //     //   }
  //     const data = {
  //       id: item.details.ticket + "-" + index,
  //       ticket: item.details.ticket,
  //       number: index,
  //       name: name,
  //       email: email,
  //     };
  //     const clean = (prev: any) => {
  //       let cleared = prev.filter(function (item: any) {
  //         return item.id != data.id;
  //       });
  //       console.log([...cleared, data]);
  //       return [...cleared, data];
  //     };
  //     setGuests((prev: any) => (prev ? clean(prev) : [data]));
  //   }, [email, name]);

  //   useEffect(() => {
  //     const initialValue = 0;
  //     let subtotal = count
  //       .filter((item: any) => {
  //         return item.event === id;
  //       })
  //       .reduce((accumulator, currentValue) => {
  //         return (
  //           accumulator +
  //           parseFloat(currentValue.details.cost) * currentValue.details.count
  //         );
  //       }, initialValue);

  //     let fee = subtotal * 0.07;
  //     let total = subtotal + fee;
  //     setTotal({
  //       total: formatter.format(total.toFixed(2)),
  //       subtotal: formatter.format(subtotal.toFixed(2)),
  //       fee: formatter.format(+fee.toFixed(2)),
  //     });
  //   }, [count]);

  //   const getDefault = (ticket: any) => {
  //     let defaultValue = count.filter((i: any) => {
  //       return i.details.ticket === ticket;
  //     });
  //     return defaultValue[0] ? defaultValue[0].details.count : 0;
  //   };

  //   function buttonStatus(session: any, step: number, isFilled: boolean) {
  //     if (session == undefined && step == 1) {
  //       return ["Login to purchase now", true];
  //     } else if (session != undefined && step == 1) {
  //       return ["Purchase now", true];
  //     } else if (session != undefined && step == 2 && !isFilled) {
  //       return ["Please add guest(s)", false];
  //     } else if (session != undefined && step == 2 && isFilled) {
  //       return ["Pay now", true];
  //     }
  //   }
  //   function createGuest(name: any, value: any, index: number, current: any) {
  //     // console.log(name, value, index, current);
  //     let email: any, newname: any;
  //     if (name === "fullname") {
  //       newname = value;
  //     } else if (name === "email") {
  //       email = value;
  //     }
  //     const data = {
  //       ticket: current.details.ticket,
  //       number: index,
  //       name: newname,
  //       email: email,
  //     };
  //     const clean = (prev: any) => {
  //       let cleared = prev.filter(function (item: any) {
  //         return (
  //           item.ticket != data.ticket &&
  //           item.number != data.number &&
  //           item.name != data.name
  //         );
  //       });
  //       console.log([...cleared, data]);
  //       return [...cleared, data];
  //     };
  //     // console.log(data);
  //     setGuests((prev: any) => (prev ? clean(prev) : [data]));
  //   }

  useEffect(() => {
    if (index != undefined) {
      const data = {
        id: item.details.ticket + "/" + index,
        ticket: item.details.ticket,
        number: index,
        name: name,
        email: email,
      };
      const clean = (prev: any) => {
        let cleared = prev.filter(function (item: any) {
          return item.id != data.id;
        });
        //   console.log([...cleared, data]);
        return [...cleared, data];
      };
      setGuests(clean(guests));
    }
  }, [name, email]);

  const fields = (item: any, index: any) => {
    if (item.target.name === "fullname") {
      setName(item.target.value);
      setIndex(index);
    } else if (item.target.name === "email") {
      setEmail(item.target.value);
      setIndex(index);
    }
  };

  return (
    <>
      <h3 className="pt-6" key={item.details.name}>
        {item.details.name}
      </h3>
      {Array.from(Array(+item.details.count).keys()).map(
        (i: any, index: number) => {
          i;
          return (
            <>
              {/* <div>{it.details.name}</div> */}
              <div className="relative" key={item.ticket + "/" + index}>
                <div className="absolute bg-gray-200 px-2 rounded-b-md">
                  {index + 1}
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Full name
                  </label>
                  <div className="mt-0 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      name="fullname"
                      id="fullname"
                      onChange={(e) => {
                        fields(e, index + 1);
                      }}
                      autoComplete="given-name"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2 ">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Email address
                  </label>
                  <div className="mt-0 sm:col-span-2 sm:mt-0">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      onChange={(e) => {
                        fields(e, index + 1);
                      }}
                      autoComplete="email"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          );
        }
      )}
    </>
  );
}
