package autoshop.repository;

import autoshop.model.RepairOrder;

import java.util.List;

public interface RepairRepository {

    void save(RepairOrder order);

    RepairOrder findById(int id);

    List<RepairOrder> findAll();
}