// /********************************************************************************
//  * Copyright (c) 2021,2021 Beawre Digital SL
//  *
//  * This program and the accompanying materials are made available under the
//  * terms of the Eclipse Public License 2.0 which is available at
//  * http://www.eclipse.org/legal/epl-2.0.
//  *
//  * SPDX-License-Identifier: EPL-2.0 3
//  *
//  ********************************************************************************/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Assets.Implementation.Commands.Vulnerabilities;
using Core.Assets.Interfaces.Services;
using Core.AuditTrail.Interfaces.Services;
using Core.AuditTrail.Models;
using Core.Database.Enums;
using Core.Database.Tables;
using Core.Relationships.Implementation.Commands;
using Core.Relationships.Interfaces.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Core.Api.Controllers
{
    [Route("api"), ApiController, EnableCors("CorsRules")]
    public class VulnerabilitiesController : ControllerBase
    {
        private IAuditTrailService _auditTrailService;
        private IRelationshipService _relationshipService;
        private IVulnerabilityService _vulnerabilityService;

        public VulnerabilitiesController(IVulnerabilityService vulnerabilityService, IRelationshipService relationshipService, IAuditTrailService auditTrailService)
        {
            _vulnerabilityService = vulnerabilityService;
            _relationshipService = relationshipService;
            _auditTrailService = auditTrailService;
        }

        [HttpPost("vulnerabilities"), ProducesResponseType(201)]
        public async Task<IActionResult> CreateVulnerability([FromBody] CreateVulnerabilityCommand command)
        {
            var newValue = await _vulnerabilityService.Create(command);
            _relationshipService.Create(new CreateRelationshipCommand() {FromType = ObjectType.Asset, FromId = command.AssetId, ToType = ObjectType.Vulnerabilitie, ToId = newValue.Id});
            _auditTrailService.LogAction(AuditTrailAction.CreateVulnerabilities, newValue.Id, new AuditTrailPayloadModel() {Data = JsonConvert.SerializeObject(command)});
            return Created(newValue.Id.ToString(), newValue);
        }

        [HttpPut("vulnerabilities")]
        public IActionResult Update(UpdateVulnerabilityCommand command) => Ok(_vulnerabilityService.Update(command));

        [HttpDelete("assets/{assetId}/vulnerabilities/{id}")]
        public IActionResult Delete(Guid assetId, Guid id)
        {
            _relationshipService.Delete(x => x.FromType == ObjectType.Asset && x.ToType == ObjectType.Vulnerabilitie && x.FromId == assetId && x.ToId == id);
            _vulnerabilityService.Delete(id);
            return Ok();
        }
    }
}