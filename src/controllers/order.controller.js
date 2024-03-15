import {Gig} from "../models/gig.model.js";
import {Order} from "../models/order.model.js";
const createOrder = async (req, res) => {
    const gig = await Gig.findById(req.params.gigId);

    if(!gig){
        return res.status(404).json({message: "Gig not found"});
    }
    const newOrder = await Order.create({
        gigId: gig._id,
        img: gig.cover,
        title: gig.title,
        price: gig.price,
        freelancerId: gig.userId,
        payment_intent:"temp"
    });
    if(!newOrder){
        return res.status(400).json({message: "Order creation failed"});
    }
    res.status(201).json("Suceessfully created order");

};
const getOrders = async (req, res) => {
    const orders = await Order.find({
        ...(req.isClient ? {clientId: req.user._id} : {freelancerId: req.user._id}),
        isCompleted: true
    });
    if(!orders){
        return res.status(404).json({message: "No orders found"});
    }
    res.status(200).json(orders);
};

export { createOrder, getOrders };