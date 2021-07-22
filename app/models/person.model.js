module.exports = (mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
      {
        name: String,
        mssv: String,
        clan: String,
        description: String,
        card: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    
    schema.plugin(mongoosePaginate);

    const Person = mongoose.model("person", schema);
    return Person;
  };