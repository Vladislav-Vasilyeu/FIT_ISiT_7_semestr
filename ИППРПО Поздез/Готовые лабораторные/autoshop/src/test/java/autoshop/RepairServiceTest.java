package autoshop;

import autoshop.model.Car;
import autoshop.model.Customer;
import autoshop.model.RepairOrder;
import autoshop.model.RepairStatus;
import autoshop.repository.InMemoryRepairRepository;
import autoshop.repository.RepairRepository;
import autoshop.service.RepairService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RepairServiceTest {

    private RepairService service;

    //@Mock
    //private RepairRepository repository;

    @BeforeEach
    void setUp() {

        RepairRepository repository =
                new InMemoryRepairRepository();

        service = new RepairService(repository);
    }

    private RepairOrder createOrder() {

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

        return new RepairOrder(
                1,
                car,
                customer,
                "Замена тормозных колодок"
        );
    }

    @Test
    void shouldCreateRepairOrder() {

        RepairOrder order = createOrder();

        service.createOrder(order);

        RepairOrder result =
                service.getOrder(1);

        assertNotNull(result);

        assertEquals(
                RepairStatus.NEW,
                result.getStatus()
        );
    }

    @Test
    void shouldChangeStatusToInProgress() {

        RepairOrder order = createOrder();

        service.createOrder(order);

        service.changeStatus(
                1,
                RepairStatus.IN_PROGRESS
        );

        RepairOrder result =
                service.getOrder(1);

        assertEquals(
                RepairStatus.IN_PROGRESS,
                result.getStatus()
        );
    }

    @Test
    void shouldNotCompleteRepairBeforeItIsInProgress() {

        RepairOrder order = createOrder();

        service.createOrder(order);

        assertThrows(
                IllegalStateException.class,
                () -> service.changeStatus(
                        1,
                        RepairStatus.COMPLETED
                )
        );
    }
}