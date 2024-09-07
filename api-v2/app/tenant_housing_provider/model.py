
class HousingProgramServiceProvider(Base):
    __tablename__ = "housing_program_service_provider"

    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String, nullable=False)

    def __repr__(self):
        return f"HousingProgramServiceProvider(id={id},provider_name='{self.provider_name}')"


class HousingProgram(Base):
    __tablename__ = "housing_program"

    id = Column(Integer, primary_key=True, index=True)
    program_name = Column(String, nullable=False)
    service_provider = Column(
        Integer,
        ForeignKey('housing_program_service_provider.id'),
        nullable=False)
