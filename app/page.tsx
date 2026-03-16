export default function Home() {
  return (
    <div className="flex flex-col gap-lg lg:flex-row lg:items-start">
      {/* Left column: balance + new transaction */}
      <div className="flex flex-col gap-lg lg:flex-1">
        {/* Task 2: <BalanceCard /> */}
        <div className="rounded-default border border-border bg-surface p-lg">BalanceCard</div>

        {/* Task 3: <NewTransaction /> */}
        <div className="rounded-default border border-border bg-surface p-lg">NewTransaction</div>
      </div>

      {/* Right column: transaction list */}
      <div className="lg:w-80 lg:shrink-0">
        {/* Task 4: <TransactionList /> */}
        <div className="rounded-default border border-border bg-surface p-lg">TransactionList</div>
      </div>
    </div>
  );
}
