exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('students').insert([
        { name: 'Brandon', cohort_id: 1 },
        { name: 'Socks', cohort_id: 2 },
        { name: 'Penny', cohort_id: 3 },
      ]);
    });
};
