export const createTravelPlan = (title, description, startDate, endDate, budget, notes) => ({
    title,
    description,
    startDate,
    endDate,
    budget,
    notes
});

export const createDestination = (name, location, arrivalDate, departureDate, description, travelPlanId) => ({
    name,
    location,
    arrivalDate,
    departureDate,
    description,
    travelPlanId
});

export const createActivity = (name, date, time, location, description, estimatedCost, status, travelPlanId) => ({
    name,
    date,
    time,
    location,
    description,
    estimatedCost,
    status,
    travelPlanId
});

export const createExpense = (name, category, amount, date, description, travelPlanId) => ({
    name,
    category,
    amount,
    date,
    description,
    travelPlanId
});

export const createChecklistItem = (name, travelPlanId) => ({
    name,
    travelPlanId
});