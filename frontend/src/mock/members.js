// frontend/src/mocks/members.js

export const members = [
  {
    vgroupId: "vg-001", // Virtual Group ID, for potential expansion to multiple groups, this will always match group ID of the chairperson
    id: "m-001",
    fullName: "Alice Moyo",
    memberNumber: "VR-001",
    joinDate: "2023-01-15",
    status: "active", // active | inactive
    role: "member", // member | treasurer | chairperson
  },
  {
    vgroupId: "vg-001",
    id: "m-002",
    fullName: "Brian Ndlovu",
    memberNumber: "VR-002",
    joinDate: "2023-03-10",
    status: "active",
    role: "member"
  },
  {
    vgroupId: "vg-001",
    id: "m-003",
    fullName: "Chipo Dube",
    memberNumber: "VR-003",
    joinDate: "2024-02-01",
    status: "inactive",
    role: "member"
  },
];
