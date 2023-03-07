import ApiClient from "@/lib/axios";
// export const dynamic = "force-dynamic";

const getGuestlist = async (id: any) => {
  try {
    const response = await ApiClient().get(
      `/guestlists/all?eventId=${id}&pageNo=${1}`
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getTickets = async (id: any) => {
  try {
    const tickets = await ApiClient().get(
      `/tickets/all?eventId=${id}&pageNo=${1}`
    );
    return tickets.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getTransactions = async (id: any) => {
  try {
    const transactions = await ApiClient().get(
      `/transactions/all?eventId=${id}&pageNo=${1}`
    );
    return transactions.data.data;
  } catch (error) {
    console.log(error);
  }
};

export default async function Tickets({
  params: { id },
}: {
  params: { id: any };
}) {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const tickets = await getTickets(id);
  const guestlist = await getGuestlist(id);
  const transactions = await getTransactions(id);
  let ticketsDetails: any = [];

  // console.log(guestlist, transactions, tickets);

  const ticketSales = transactions
    // .filter((transaction: any) => transaction.ticketId === ticket.ticketId)
    ?.reduce(
      (acc: any, guest: any) =>
        // acc.price += parseFloat(guest.price);
        acc + parseInt(guest.ticketsSold),
      0
    );

  tickets.map((ticket: any, index: any) => {
    // console.log(ticket);

    const ticketCount = guestlist
      ?.filter((guest: any) => guest.ticketId === ticket.ticketId)
      ?.reduce(
        (acc: any, guest: any) => acc + 1,
        // acc.orders += parseInt(guest.ticketsSold);
        0
      );

    ticket.count = ticketCount;
    // ticket.sales = ticketSales;
    // ticket.index = index;
    // ticket.revenue = ticketRevenue;
    ticketsDetails.push(ticket);
  });

  // transactions.map((ticket: any, index: any) => {
  //   // console.log(ticket);

  //   const ticketCount = guestlist
  //     .filter((guest: any) => guest.ticketId === ticket.ticketId)
  //     .reduce(
  //       (acc: any, guest: any) => acc + 1,
  //       // acc.orders += parseInt(guest.ticketsSold);
  //       0
  //     );

  //   ticket.count = ticketCount;
  //   // ticket.sales = ticketSales;
  //   // ticket.index = index;
  //   // ticket.revenue = ticketRevenue;
  //   ticketsDetails.push(ticket);
  // });
  // console.log(JSON.stringify(ticketsDetails));
  const totalRevenue = guestlist
    ?.filter(
      (transaction: any) => transaction.ticketId === transaction.ticketId
    )
    ?.reduce(
      (acc: any, guest: any) =>
        // acc.price += parseFloat(guest.price);
        acc + parseInt(guest.price),
      0
    );

  const stats = [
    { name: "Total revenue", stat: `$${totalRevenue}` },
    { name: "Total orders", stat: transactions?.length },
    { name: "Tickets sold", stat: guestlist?.length },
  ];

  function filterItems(arr: any[], query: any) {
    const result = arr.filter((el: any) => el.ticketId === query);
    // arr.filter((el: any) => el.ticketId === query);
    // console.log(result);
    return result;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return (
    <div className="">
      <article className="mb-4">
        <div>
          {/* <h3 className="text-lg font-medium leading-6 text-gray-900">
            Last 30 days
          </h3> */}
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      <section className="">
        <div className="-mx-4 mt-4 ring-1 ring-gray-100 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-6"
                >
                  Ticket name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-500 lg:table-cell"
                >
                  Processing fee
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-right text-sm font-semibold text-gray-500"
                >
                  Ticket revenue
                </th>
                {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Select</span>
                  </th> */}
              </tr>
            </thead>
            <tbody>
              {tickets.map((plan, planIdx) => (
                <tr key={planIdx}>
                  <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-transparent",
                      "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                    )}
                  >
                    <div className="font-medium text-gray-900">{plan.name}</div>
                    {planIdx !== 0 ? (
                      <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" />
                    ) : null}
                  </td>
                  <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {filterItems(ticketsDetails, plan.ticketId)[0].count}/
                    {plan.quantity}
                  </td>
                  <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {formatter.format(plan.price)}
                  </td>
                  <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                    )}
                  >
                    {formatter.format(
                      filterItems(ticketsDetails, plan.ticketId)[0].count *
                        plan.price *
                        0.07
                    )}
                  </td>
                  <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-gray-200",
                      "px-3 py-3.5 text-right text-sm text-gray-500"
                    )}
                  >
                    {formatter.format(
                      filterItems(ticketsDetails, plan.ticketId)[0].count *
                        plan.price
                    )}
                  </td>
                  {/* <td
                      className={classNames(
                        planIdx === 0 ? "" : "border-t border-transparent",
                        "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                      )}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                        disabled={plan.isCurrent}
                      >
                        Select<span className="sr-only">, {plan.name}</span>
                      </button>
                      {planIdx !== 0 ? (
                        <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" />
                      ) : null}
                    </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
