package autoshop;

import autoshop.model.Car;
import autoshop.model.Customer;
import autoshop.model.RepairOrder;
import autoshop.model.RepairStatus;
import autoshop.repository.InMemoryRepairRepository;
import autoshop.repository.RepairRepository;
import autoshop.service.RepairService;

public class Main {

    public static void main(String[] args) {

        RepairRepository repository =
                new InMemoryRepairRepository();

        RepairService service =
                new RepairService(repository);

        Car car = new Car(
                1,
                "BMW",
                "X5",
                "1234 AB-7"
        );

        Customer customer = new Customer(
                1,
                "Иван Иванов",
                "+375291234567"
        );

        RepairOrder order = new RepairOrder(
                1,
                car,
                customer,
                "Замена тормозных колодок"
        );

        service.createOrder(order);

        System.out.println("Создан заказ:");
        System.out.println(service.getOrder(1));

        /*service.changeStatus(
                1,
                RepairStatus.COMPLETED
        );*/

        service.changeStatus(
                1,
                RepairStatus.IN_PROGRESS
        );

        System.out.println();
        System.out.println("Ремонт начат:");
        System.out.println(service.getOrder(1));

        service.changeStatus(
                1,
                RepairStatus.COMPLETED
        );

        System.out.println();
        System.out.println("Ремонт завершён:");
        System.out.println(service.getOrder(1));
    }
}