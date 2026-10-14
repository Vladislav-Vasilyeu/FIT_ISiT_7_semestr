package autoshop.service;

import autoshop.model.RepairOrder;
import autoshop.model.RepairStatus;
import autoshop.repository.RepairRepository;

public class RepairService {

    private final RepairRepository repository;

    public RepairService(RepairRepository repository) {
        this.repository = repository;
    }

    public void createOrder(RepairOrder order) {
        repository.save(order);
    }

    public RepairOrder getOrder(int id) {
        return repository.findById(id);
    }

    public void changeStatus(
            int orderId,
            RepairStatus newStatus
    ) {
        RepairOrder order = repository.findById(orderId);

        if (order == null) {
            throw new IllegalArgumentException(
                    "Заказ не найден"
            );
        }

        if (newStatus == RepairStatus.COMPLETED
                && order.getStatus() != RepairStatus.IN_PROGRESS) {

            throw new IllegalStateException(
                    "Нельзя завершить ремонт, " +
                            "если ремонт еще не выполнен"
            );
        }

        order.setStatus(newStatus);

        repository.save(order);
    }
}