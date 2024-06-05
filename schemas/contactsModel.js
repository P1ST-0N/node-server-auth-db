import { Schema, model } from "mongoose";
// import userFilter

export const queryProjection = "-createAt -updateAt -owner";
export const filter = "name, email, phone, favorite";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: String,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      select: false,
    },
  },
  { versionKey: false, timestamps: true }
);

// replace '_id' to 'id' and remove service fields
contactSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;

    queryProjection.split(" ").forEach((field) => {
      if (field.length > 0 && field[0] === "-") {
        delete ret[field.slice(1)];
      }
    });
  },
});

// add query middleware
contactSchema.pre(/^find/, function (next) {
  if (userFilter.id) {
    this.find({ owner: userFilter.id });
  }
  next();
});

contactSchema.pre(/^count/, function (next) {
  if (userFilter.id) {
    this.find({ owner: userFilter.id });
  }
  next();
});

const Contact = model("contact", contactSchema);

export default Contact;
