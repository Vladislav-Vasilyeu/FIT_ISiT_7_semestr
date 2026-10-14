package autoshop.repository;

import autoshop.model.RepairOrder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InMemoryRepairRepository
        implements RepairRepository {

    private final Map<Integer, RepairOrder> orders =
            new HashMap<>();

    @Override
    public void save(RepairOrder order) {
        orders.put(order.getId(), order);
    }

    @Override
    public RepairOrder findById(int id) {
        return orders.get(id);
    }

    @Override
    public List<RepairOrder> findAll() {
        return new ArrayList<>(orders.values());
    }
}