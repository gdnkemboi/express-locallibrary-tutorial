const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Virtual for formatted date of birth
AuthorSchema.virtual("formattedDoB").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});

// Virtual for formatted date of death
AuthorSchema.virtual("formattedDoD").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

// Virtual for author lifespan
AuthorSchema.virtual("lifespan").get(function () {
  // Check if there's a date of birth
  if (!this.date_of_birth) return "";

  // If there's a date of birth but no date of death, return the date of birth followed by a hyphen
  if (this.date_of_birth && !this.date_of_death)
    return `${this.formattedDoB} -`;

  // If both dates are present, return the date of birth followed by a hyphen and the date of death
  return `${this.formattedDoB} - ${this.formattedDoD}`;
});

// Virtual for date of birth in the format YYYY-MM-DD
AuthorSchema.virtual("yearMonthDateDoB").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toISODate()
    : "";
});

// Virtual for date of death in the format YYYY-MM-DD
AuthorSchema.virtual("yearMonthDateDoD").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toISODate()
    : "";
});

module.exports = mongoose.model("Author", AuthorSchema);
