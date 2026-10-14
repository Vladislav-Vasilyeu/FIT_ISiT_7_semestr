package autoshop.model;

public class RepairOrder {

    private final int id;
    private final Car car;
    private final Customer customer;
    private final String description;

    private RepairStatus status;

    public RepairOrder(
            int id,
            Car car,
            Customer customer,
            String description
    ) {
        this.id = id;
        this.car = car;
        this.customer = customer;
        this.description = description;
        this.status = RepairStatus.NEW;
    }

    public int getId() {
        return id;
    }

    public Car getCar() {
        return car;
    }

    public Customer getCustomer() {
        return customer;
    }

    public String getDescription() {
        return description;
    }

    public RepairStatus getStatus() {
        return status;
    }

    public void setStatus(RepairStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Заказ №" + id +
                ", автомобиль: " + car +
                ", клиент: " + customer +
                ", описание: " + description +
                ", статус: " + status;
    }
}