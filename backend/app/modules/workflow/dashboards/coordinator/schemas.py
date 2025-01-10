from pydantic import BaseModel, ConfigDict


class UnmatchedCaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UnmatchedCaseStatusSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
