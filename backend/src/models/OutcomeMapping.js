import mongoose from "mongoose"

const outcomeMappingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      default: null,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    sourceType: {
      type: String,
      required: true,
      enum: ["existing_curriculum", "existing_course", "manual"],
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseCode: {
      type: String,
      required: true,
      trim: true,
    },
    syllabusText: {
      type: String,
      required: true,
    },
    includesMatrix: {
      type: Boolean,
      required: true,
      default: false,
    },
    programOutcomes: {
      type: [
        {
          poNumber: { type: Number, required: true },
          statement: { type: String, required: true },
        },
      ],
      default: [],
    },
    generatedOutcomes: {
      courseOutcomes: [
        {
          coNumber: { type: Number, required: true },
          statement: { type: String, required: true },
          bloomsLevel: { type: String, required: true },
        },
      ],
      copoMatrix: {
        type: [
          {
            coNumber: { type: Number, required: true },
            poMappings: [
              {
                poNumber: { type: Number, required: true },
                correlationLevel: { type: Number, enum: [0, 1, 2, 3], required: true },
              },
            ],
          },
        ],
        default: [],
      },
      matrixSummary: {
        averageCorrelation: { type: Number, default: null },
        strongMappings: { type: Number, default: null },
        moderateMappings: { type: Number, default: null },
        weakMappings: { type: Number, default: null },
      },
    },
  },
  {
    timestamps: true,
  }
)

const OutcomeMapping = mongoose.model("OutcomeMapping", outcomeMappingSchema)
export default OutcomeMapping
