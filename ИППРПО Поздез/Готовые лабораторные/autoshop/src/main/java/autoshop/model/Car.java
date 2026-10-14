package autoshop.model;

public class Car {

    private final int id;
    private final String brand;
    private final String model;
    private final String licensePlate;

    public Car(int id, String brand, String model, String licensePlate) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.licensePlate = licensePlate;
    }

    public int getId() {
        return id;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    @Override
    public String toString() {
        return brand + " " + model +
                " (" + licensePlate + ")";
    }
}