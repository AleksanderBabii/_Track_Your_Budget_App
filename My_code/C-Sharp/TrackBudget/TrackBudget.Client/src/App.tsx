import { useState } from "react";

import { Button } from "./components/common/Button/Button";
import { Card } from "./components/common/Card/Card";
import { Input } from "./components/common/Input/Input";
import { Modal } from "./components/common/Modal/Modal";
import { Select } from "./components/common/Select/Select";
import { Spinner } from "./components/common/Spinner/Spinner";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main
      style={{
        width: "min(100% - 32px, 900px)",
        margin: "60px auto",
      }}
    >
      <Card
        title="TrackBudget UI"
        subtitle="Reusable component test"
      >
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          <Input
            label="Account name"
            placeholder="Main Account"
          />

          <Select
            label="Currency"
            options={[
              { value: "PLN", label: "PLN" },
              { value: "EUR", label: "EUR" },
              { value: "USD", label: "USD" },
            ]}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Button onClick={() => setIsModalOpen(true)}>
              Open modal
            </Button>

            <Button variant="secondary">Secondary</Button>

            <Button variant="danger">Delete</Button>

            <Spinner />
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        title="Create account"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button>Create</Button>
          </>
        }
      >
        <p>This is the reusable TrackBudget modal.</p>
      </Modal>
    </main>
  );
}

export default App;